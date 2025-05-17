import os
import tempfile
import subprocess
import shutil
from typing import List, Dict, Optional, Tuple, Any
import logging
import re
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ResumeGenerator:
    def __init__(self, output_dir: str = None):
        """
        Initialize the resume generator
        
        Parameters:
        -----------
        output_dir : str, optional
            Directory to save the output PDF. Defaults to current directory.
        """
        # Set up the output directory structure
        self.base_dir = output_dir or os.getcwd()
        self.pdf_dir = os.path.join(self.base_dir, "generated_pdfs")
        
        # Create necessary directories
        os.makedirs(self.base_dir, exist_ok=True)
        os.makedirs(self.pdf_dir, exist_ok=True)
        
    def _generate_filename(self, base_name: str) -> str:
        """
        Generate a filename with timestamp
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Remove .pdf extension if present
        base_name = base_name.replace('.pdf', '')
        return f"{base_name}_{timestamp}.pdf"

    def _escape_latex(self, text: str) -> str:
        """
        Escape special LaTeX characters in the text
        """
        special_chars = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\^{}',
            '\\': r'\textbackslash{}',
            '<': r'\textless{}',
            '>': r'\textgreater{}',
        }
        return ''.join(special_chars.get(c, c) for c in text)

    def generate_resume(self,
                        # Personal Information
                        full_name: str,
                        phone_number: str,
                        email: str,
                        linkedin_url: str,
                        github_url: str,
                        
                        # Education
                        education_entries: List[Dict[str, str]],
                        
                        # Experience
                        experience_entries: List[Dict[str, Any]],
                        
                        # Projects
                        project_entries: List[Dict[str, Any]],
                        
                        # Technical Skills
                        languages: List[str],
                        frameworks: List[str],
                        developer_tools: List[str],
                        libraries: List[str],
                        
                        output_filename: str = "resume.pdf") -> str:
        """
        Generate a PDF resume from the provided information
        
        Parameters:
        -----------
        full_name : str
            Your full name
        phone_number : str
            Your phone number
        email : str
            Your email address
        linkedin_url : str
            Your LinkedIn URL (without the 'https://' prefix)
        github_url : str
            Your GitHub URL (without the 'https://' prefix)
            
        education_entries : List[Dict[str, str]]
            List of education entries, each containing:
                'institution': Institution name
                'location': Location
                'degree': Degree earned
                'date_range': Date range (e.g., "Aug. 2018 -- May 2021")
                
        experience_entries : List[Dict[str, Any]]
            List of experience entries, each containing:
                'title': Job title
                'dates': Employment dates
                'organization': Organization name
                'location': Location
                'responsibilities': List of job responsibilities/achievements
                
        project_entries : List[Dict[str, Any]]
            List of project entries, each containing:
                'name': Project name
                'technologies': Technologies used (formatted string)
                'date_range': Date range for the project
                'details': List of project details/achievements
                
        languages : List[str]
            List of programming languages
        frameworks : List[str]
            List of frameworks
        developer_tools : List[str]
            List of developer tools
        libraries : List[str]
            List of libraries
            
        output_filename : str, optional
            Name of the output PDF file. Defaults to "resume.pdf"
            
        Returns:
        --------
        str
            Path to the generated PDF file
        """
        # Generate filename with timestamp
        output_filename = self._generate_filename(output_filename)
        
        # Create a temporary directory to store LaTeX files
        temp_dir = tempfile.mkdtemp()
        try:
            logger.info("Starting PDF generation process")
            
            # Create the LaTeX content
            latex_content = self._create_latex_content(
                full_name, phone_number, email, linkedin_url, github_url,
                education_entries, experience_entries, project_entries,
                languages, frameworks, developer_tools, libraries
            )
            
            # Write LaTeX content to a file
            tex_path = os.path.join(temp_dir, "resume.tex")
            with open(tex_path, "w", encoding='utf-8') as tex_file:
                tex_file.write(latex_content)
            
            logger.info("LaTeX file created, starting compilation")
            
            # Compile the LaTeX file to PDF with timeout
            try:
                process = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", "-output-directory", temp_dir, tex_path],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=30  # 30 seconds timeout
                )
                
                logger.info("PDF compilation completed")
                
                # Copy the PDF to the output directory
                pdf_path = os.path.join(temp_dir, "resume.pdf")
                output_path = os.path.join(self.pdf_dir, output_filename)
                
                if not os.path.exists(pdf_path):
                    raise FileNotFoundError("Generated PDF file not found")
                
                # Copy the file instead of reading and writing
                shutil.copy2(pdf_path, output_path)
                
                logger.info(f"PDF successfully generated at: {output_path}")
                return output_path
                
            except subprocess.TimeoutExpired:
                logger.error("PDF generation timed out after 30 seconds")
                raise Exception("PDF generation timed out. Please try again.")
            except subprocess.CalledProcessError as e:
                logger.error(f"Error compiling LaTeX: {e}")
                logger.error(f"STDOUT: {e.stdout.decode('utf-8')}")
                logger.error(f"STDERR: {e.stderr.decode('utf-8')}")
                raise Exception(f"Error generating PDF: {e.stderr.decode('utf-8')}")
            except Exception as e:
                logger.error(f"Unexpected error during PDF generation: {str(e)}")
                raise Exception(f"Error generating PDF: {str(e)}")
                
        finally:
            # Clean up temporary directory
            try:
                shutil.rmtree(temp_dir)
                logger.info("Temporary files cleaned up")
            except Exception as e:
                logger.warning(f"Error cleaning up temporary files: {str(e)}")
            
    def _create_latex_content(self,
                              full_name: str,
                              phone_number: str,
                              email: str,
                              linkedin_url: str,
                              github_url: str,
                              education_entries: List[Dict[str, str]],
                              experience_entries: List[Dict[str, Any]],
                              project_entries: List[Dict[str, Any]],
                              languages: List[str],
                              frameworks: List[str],
                              developer_tools: List[str],
                              libraries: List[str]) -> str:
        """Create the LaTeX content for the resume"""
        # Escape all text inputs
        full_name = self._escape_latex(full_name)
        phone_number = self._escape_latex(phone_number)
        email = self._escape_latex(email)
        linkedin_url = self._escape_latex(linkedin_url)
        github_url = self._escape_latex(github_url)

        # Preamble
        latex_content = r"""%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{graphicx}
\usepackage{float}
\usepackage{geometry}
\usepackage{xparse}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\NewDocumentCommand{\resumeItem}{m}{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\NewDocumentCommand{\resumeSubheading}{mmmm}{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\NewDocumentCommand{\resumeSubSubheading}{mm}{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\NewDocumentCommand{\resumeProjectHeading}{mm}{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\NewDocumentCommand{\resumeSubItem}{m}{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\NewDocumentEnvironment{resumeSubHeadingListStart}{}{
  \begin{itemize}[leftmargin=0.15in, label={}]
}{
  \end{itemize}
}

\NewDocumentEnvironment{resumeItemListStart}{}{
  \begin{itemize}
}{
  \end{itemize}\vspace{-5pt}
}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}
"""

        # Header
        latex_content += fr"""
%----------HEADING----------
\begin{{tabular*}}{{\textwidth}}{{l@{{\extracolsep{{\fill}}}}r}}
    \textbf{{\Huge \scshape {full_name}}} & {phone_number} \\
    \href{{mailto:{email}}}{{\underline{{{email}}}}} $|$ 
    \href{{https://{linkedin_url}}}{{\underline{{{linkedin_url}}}}} $|$
    \href{{https://{github_url}}}{{\underline{{{github_url}}}}}
\end{{tabular*}}

"""

        # Education section
        latex_content += r"""
%-----------EDUCATION-----------
\section{Education}
  \begin{resumeSubHeadingListStart}
"""
        for edu in education_entries:
            latex_content += fr"""    \resumeSubheading
      {{{self._escape_latex(edu['institution'])}}}{{{self._escape_latex(edu['location'])}}}
      {{{self._escape_latex(edu['degree'])}}}{{{self._escape_latex(edu['date_range'])}}}
"""
        latex_content += r"""  \end{resumeSubHeadingListStart}

"""

        # Experience section
        latex_content += r"""
%-----------EXPERIENCE-----------
\section{Experience}
  \begin{resumeSubHeadingListStart}
"""
        for exp in experience_entries:
            latex_content += fr"""
    \resumeSubheading
      {{{self._escape_latex(exp['title'])}}}{{{self._escape_latex(exp['dates'])}}}
      {{{self._escape_latex(exp['organization'])}}}{{{self._escape_latex(exp['location'])}}}
      \begin{{resumeItemListStart}}
"""
            for resp in exp['responsibilities']:
                latex_content += fr"""        \resumeItem{{{self._escape_latex(resp)}}}
"""
            latex_content += r"""      \end{resumeItemListStart}
"""
        latex_content += r"""
  \end{resumeSubHeadingListStart}

"""

        # Projects section
        latex_content += r"""
%-----------PROJECTS-----------
\section{Projects}
    \begin{resumeSubHeadingListStart}
"""
        for proj in project_entries:
            latex_content += fr"""      \resumeProjectHeading
          {{\textbf{{{self._escape_latex(proj['name'])}}} $|$ \emph{{{self._escape_latex(proj['technologies'])}}}}}{{{"" if 'date_range' not in proj else self._escape_latex(proj['date_range'])}}}
          \begin{{resumeItemListStart}}
"""
            for detail in proj['details']:
                latex_content += fr"""            \resumeItem{{{self._escape_latex(detail)}}}
"""
            latex_content += r"""          \end{resumeItemListStart}
"""
        latex_content += r"""    \end{resumeSubHeadingListStart}

"""

        # Technical Skills section
        languages_str = ', '.join(self._escape_latex(lang) for lang in languages)
        frameworks_str = ', '.join(self._escape_latex(fw) for fw in frameworks)
        developer_tools_str = ', '.join(self._escape_latex(tool) for tool in developer_tools)
        libraries_str = ', '.join(self._escape_latex(lib) for lib in libraries)
        
        latex_content += fr"""
%-----------PROGRAMMING SKILLS-----------
\section{{Technical Skills}}
 \begin{{itemize}}[leftmargin=0.15in, label={{}}]
    \small{{\item{{
     \textbf{{Languages}}{{: {languages_str}}} \\
     \textbf{{Frameworks}}{{: {frameworks_str}}} \\
     \textbf{{Developer Tools}}{{: {developer_tools_str}}} \\
     \textbf{{Libraries}}{{: {libraries_str}}}
    }}}}
 \end{{itemize}}

"""

        # End document
        latex_content += r"""
%-------------------------------------------
\end{document}
"""
        return latex_content


def generate_resume_pdf(
    # Personal Information
    full_name: str,
    phone_number: str,
    email: str,
    linkedin_url: str,
    github_url: str,
    
    # Education
    education_entries: List[Dict[str, str]],
    
    # Experience
    experience_entries: List[Dict[str, Any]],
    
    # Projects
    project_entries: List[Dict[str, Any]],
    
    # Technical Skills
    languages: List[str],
    frameworks: List[str],
    developer_tools: List[str],
    libraries: List[str],
    
    output_filename: str = "resume.pdf",
    output_dir: str = None
) -> str:
    """
    Generate a PDF resume from the provided information
    
    Parameters:
    -----------
    full_name : str
        Your full name
    phone_number : str
        Your phone number
    email : str
        Your email address
    linkedin_url : str
        Your LinkedIn URL (without the 'https://' prefix)
    github_url : str
        Your GitHub URL (without the 'https://' prefix)
        
    education_entries : List[Dict[str, str]]
        List of education entries, each containing:
            'institution': Institution name
            'location': Location
            'degree': Degree earned
            'date_range': Date range (e.g., "Aug. 2018 -- May 2021")
            
    experience_entries : List[Dict[str, Any]]
        List of experience entries, each containing:
            'title': Job title
            'dates': Employment dates
            'organization': Organization name
            'location': Location
            'responsibilities': List of job responsibilities/achievements
            
    project_entries : List[Dict[str, Any]]
        List of project entries, each containing:
            'name': Project name
            'technologies': Technologies used (formatted string)
            'date_range': Date range for the project (optional)
            'details': List of project details/achievements
            
    languages : List[str]
        List of programming languages
    frameworks : List[str]
        List of frameworks
    developer_tools : List[str]
        List of developer tools
    libraries : List[str]
        List of libraries
        
    output_filename : str, optional
        Name of the output PDF file. Defaults to "resume.pdf"
    output_dir : str, optional
        Directory to save the output PDF. Defaults to current directory.
        
    Returns:
    --------
    str
        Path to the generated PDF file
    """
    generator = ResumeGenerator(output_dir=output_dir)
    return generator.generate_resume(
        full_name, phone_number, email, linkedin_url, github_url,
        education_entries, experience_entries, project_entries,
        languages, frameworks, developer_tools, libraries,
        output_filename
    )
