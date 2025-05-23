module.exports = {
    apps: [
      {
        name: "pdf-service",
        script: "uvicorn",
        args: "app.main:app --host 0.0.0.0 --port 8501",
        interpreter: "venv/bin/python",
        watch: false,
        env: {
          PYTHONUNBUFFERED: "1"
        }
      }
    ]
  };