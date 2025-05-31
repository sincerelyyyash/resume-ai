import os
import tempfile
import subprocess
import shutil
from typing import List, Dict, Optional, Tuple, Any
import logging
import re
from datetime import datetime
import json

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

    def _validate_input_data(self, data: Dict[str, Any]) -> None:
        """
        Validate the input data for required fields and correct types
        """
        required_fields = {
            'full_name': str,
            'email': str,
            'education_entries': list,
            'experience_entries': list,
            'project_entries': list
        }

        # Validate required fields
        for field, field_type in required_fields.items():
            if field not in data:
                raise ValueError(f"Missing required field: {field}")
            if not isinstance(data[field], field_type):
                raise ValueError(f"Invalid type for {field}. Expected {field_type.__name__}, got {type(data[field]).__name__}")

        # Set default values for optional fields
        data.setdefault('linkedin_url', '')
        data.setdefault('github_url', '')
        data.setdefault('languages', [])
        data.setdefault('frameworks', [])
        data.setdefault('developer_tools', [])
        data.setdefault('libraries', [])

        # Validate education entries
        for i, edu in enumerate(data['education_entries']):
            required_edu_fields = ['institution', 'degree', 'date_range']
            for field in required_edu_fields:
                if field not in edu:
                    raise ValueError(f"Missing required field '{field}' in education entry {i}")
            edu.setdefault('location', '')

        # Validate experience entries
        for i, exp in enumerate(data['experience_entries']):
            required_exp_fields = ['title', 'dates', 'organization', 'responsibilities']
            for field in required_exp_fields:
                if field not in exp:
                    raise ValueError(f"Missing required field '{field}' in experience entry {i}")
            exp.setdefault('location', '')

        # Validate project entries
        for i, proj in enumerate(data['project_entries']):
            required_proj_fields = ['name', 'technologies', 'details']
            for field in required_proj_fields:
                if field not in proj:
                    raise ValueError(f"Missing required field '{field}' in project entry {i}")
            proj.setdefault('date_range', None)

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
                        email: str,
                        linkedin_url: str,
                        github_url: str,
                        education_entries: List[Dict[str, str]],
                        experience_entries: List[Dict[str, Any]],
                        project_entries: List[Dict[str, Any]],
                        skill_categories: List[Dict[str, Any]],
                        output_filename: str = "resume.pdf",
                        phone_number: Optional[str] = None,
                        website_url: Optional[str] = None) -> str:
        """
        Generate a PDF resume from the provided information
        """
        try:
            # Validate input data
            input_data = {
                'full_name': full_name,
                'email': email,
                'linkedin_url': linkedin_url,
                'github_url': github_url,
                'website_url': website_url,
                'education_entries': education_entries,
                'experience_entries': experience_entries,
                'project_entries': project_entries,
                'skill_categories': skill_categories
            }
            
            logger.info("Validating input data...")
            self._validate_input_data(input_data)
            logger.info("Input data validation successful")

            # Generate filename with timestamp
            output_filename = self._generate_filename(output_filename)
            
            # Create a temporary directory to store LaTeX files
            temp_dir = tempfile.mkdtemp()
            try:
                logger.info("Starting PDF generation process")
                
                # Create the LaTeX content
                latex_content = self._create_latex_content(
                    full_name, email, linkedin_url, github_url,
                    education_entries, experience_entries, project_entries,
                    skill_categories, phone_number, website_url
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
                    
        except Exception as e:
            logger.error(f"Error in generate_resume: {str(e)}")
            logger.error(f"Input data: {json.dumps(input_data, indent=2)}")
            raise

    def _create_latex_content(self,
                              full_name: str,
                              email: str,
                              linkedin_url: str,
                              github_url: str,
                              education_entries: List[Dict[str, str]],
                              experience_entries: List[Dict[str, Any]],
                              project_entries: List[Dict[str, Any]],
                              skill_categories: List[Dict[str, Any]],
                              phone_number: Optional[str] = None,
                              website_url: Optional[str] = None) -> str:
        """Create the LaTeX content for the resume"""
        # Escape all text inputs
        full_name = self._escape_latex(full_name)
        phone_number = self._escape_latex(phone_number) if phone_number else ''
        email = self._escape_latex(email)
        linkedin_url = self._escape_latex(linkedin_url) if linkedin_url else ''
        github_url = self._escape_latex(github_url) if github_url else ''
        website_url = self._escape_latex(website_url) if website_url else ''

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

% Adjust margins to use more space
\geometry{
    top=0.5in,
    bottom=0.5in,
    left=0.5in,
    right=0.5in,
    includehead,
    includefoot
}

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
        website_part = f" $|$ \\href{{https://{website_url}}}{{\\underline{{{website_url}}}}}" if website_url else ""
        latex_content += f"""
%----------HEADING----------
\\begin{{center}}
    \\textbf{{\\Huge \\scshape {full_name}}} \\\\
    \\vspace{{2pt}}
    \\href{{mailto:{email}}}{{\\underline{{{email}}}}} $|$ 
    \\href{{https://{linkedin_url}}}{{\\underline{{{linkedin_url}}}}} $|$
    \\href{{https://{github_url}}}{{\\underline{{{github_url}}}}}{website_part}
\\end{{center}}

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
        latex_content += r"""
%-----------TECHNICAL SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
"""
        for category in skill_categories:
            skills_str = ', '.join(self._escape_latex(skill) for skill in category['skills'])
            latex_content += fr"""    \small{{\item{{
     \textbf{{{self._escape_latex(category['category_name'])}}}{{: {skills_str}}}
    }}}}
"""
        latex_content += r""" \end{itemize}

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
    education_entries: List[Dict[str, str]],
    experience_entries: List[Dict[str, Any]],
    project_entries: List[Dict[str, Any]],
    skill_categories: List[Dict[str, Any]],
    output_filename: str = "resume.pdf",
    output_dir: str = None,
    website_url: Optional[str] = None
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
            
    skill_categories : List[Dict[str, Any]]
        List of skill categories, each containing:
            'category_name': Name of the skill category
            'skills': List of skills in that category
            
    output_filename : str, optional
        Name of the output PDF file. Defaults to "resume.pdf"
    output_dir : str, optional
        Directory to save the output PDF. Defaults to current directory.
    website_url : str, optional
        Your website/portfolio URL (without the 'https://' prefix)
        
    Returns:
    --------
    str
        Path to the generated PDF file
    """
    generator = ResumeGenerator(output_dir=output_dir)
    return generator.generate_resume(
        full_name, email, linkedin_url, github_url,
        education_entries, experience_entries, project_entries,
        skill_categories, output_filename, phone_number, website_url
    )