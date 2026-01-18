#!/usr/bin/env python3
"""Convert text payloads to PDF format for HireFlow resume upload."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import os
import sys

def txt_to_pdf(txt_path: str, pdf_path: str):
    """Convert a text file to PDF."""
    with open(txt_path, 'r') as f:
        content = f.read()
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = getSampleStyleSheet()
    mono_style = ParagraphStyle(
        'Mono',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        spaceAfter=6
    )
    
    story = []
    
    # Split by lines and create paragraphs
    for line in content.split('\n'):
        if line.strip() == '':
            story.append(Spacer(1, 6))
        else:
            # Escape special characters for reportlab
            safe_line = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(safe_line, mono_style))
    
    doc.build(story)
    print(f"Created: {pdf_path}")

def main():
    payload_dir = "hireflow/workshop/payloads"
    
    txt_files = [
        "01-basic-override.txt",
        "02-role-injection.txt", 
        "03-json-injection.txt",
        "04-stealth-injection.txt"
    ]
    
    for txt_file in txt_files:
        txt_path = os.path.join(payload_dir, txt_file)
        pdf_path = txt_path.replace('.txt', '.pdf')
        
        if os.path.exists(txt_path):
            txt_to_pdf(txt_path, pdf_path)
        else:
            print(f"Not found: {txt_path}")

if __name__ == "__main__":
    main()
