import reportlab
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import Color
import os
from reportlab.platypus import SimpleDocTemplate, PageBreak, Paragraph, Spacer, TableStyle, Table
from reportlab.platypus.flowables import HRFlowable
from generators.pdf_style import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import mm

PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
styles = getSampleStyleSheet()
titleStyle = styles['Heading3']
paraStyle = styles['BodyText']
bulletStyle = styles['Bullet']
definitionStyle = styles['Small']
boldStyle = styles['Heading5']
techStyle = styles['Tech']

ACCENT = Color(242/255, 183/255, 5/255)

class PDF():
    def __init__(self) -> None:
         self.load_fonts()
    def filename(self, lang):
        return f"cv_{lang}.pdf"
    def load_fonts(self):
        folder = os.path.dirname(__file__) + os.sep + '../../fonts'
        for file in os.listdir(folder):
             (file_name,_) = os.path.splitext(os.path.basename(file))
             pdfmetrics.registerFont(TTFont(file_name, os.path.join(folder, file)))
    def layout(self, c: canvas.Canvas, doc: SimpleDocTemplate):
        c.saveState()
        c.setAuthor("Florian Kasper")
        c.setTitle("Software and DevOps Engineer")

        # Dark header background
        c.setFillColorRGB(19/255, 22/255, 38/255)
        c.rect(0, PAGE_HEIGHT-75, PAGE_WIDTH, 75, 0, 1)

        # Gold accent line under header
        c.setStrokeColorRGB(242/255, 183/255, 5/255)
        c.setLineWidth(2)
        c.line(0, PAGE_HEIGHT-75, PAGE_WIDTH, PAGE_HEIGHT-75)

        # Name - white
        c.setFillColorRGB(1, 1, 1)
        c.setFont("Montserrat-SemiBold", 18)
        c.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-28, "Florian Kasper")

        # Subtitle - gold
        c.setFillColorRGB(242/255, 183/255, 5/255)
        c.setFont("Montserrat-Regular", 11)
        c.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-44, "Software and DevOps Engineer")

        # Contact info - light gray
        c.setFillColorRGB(0.75, 0.75, 0.75)
        c.setFont("Montserrat-Light", 7)
        c.drawCentredString(45*mm, PAGE_HEIGHT-62, "info@florian-kasper.com")
        c.drawCentredString(PAGE_WIDTH/2, PAGE_HEIGHT-62, "+49 1516 7522873")
        c.drawCentredString(PAGE_WIDTH-45*mm, PAGE_HEIGHT-62, "florian-kasper.com")

        # Page number
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.setFont("Montserrat-Regular", 7)
        c.drawCentredString(PAGE_WIDTH/2.0, 10*mm, f"{doc.page}")

        c.restoreState()

    def sectionLine(self):
        return HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=2*mm, spaceBefore=0)

    def projects(self, history, title="Project History"):
        tabledata = []

        for data in history:
            items = []

            # Role and client with industry
            role_text = f"{data['role']} for {data['client']}"
            if data.get('industry'):
                role_text += f"  ·  {data['industry']}"
            items.append(Paragraph(role_text, style=boldStyle))

            # Tech stack
            if data.get('tech'):
                items.append(Paragraph(data['tech'], style=techStyle))

            items.append(Spacer(1, 1.5*mm))

            # Key points with bullet character
            keypoints = []
            for kp in data['key_points']:
                keypoints.append(Paragraph(f"\u2022  {kp}", style=bulletStyle))
            items.append(keypoints)

            start = data["start"]
            end = data["end"]
            tabledata.append([
                Paragraph(f"{start} - {end}", style=paraStyle),
                items
            ])
        table = Table(
            tabledata,
            colWidths=[50*mm, None])
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('ALIGN',(0,0),(-1,-1),'LEFT'),
            ('TOPPADDING',(0,0),(-1,-1),4*mm),
            ('BOTTOMPADDING',(0,0),(-1,-1),1*mm),
        ]))
        paragraphs = [
            Spacer(1, 8*mm),
            Paragraph(title, style=titleStyle),
            self.sectionLine(),
            table
        ]
        return paragraphs

    def skillsOverview(self, cv):
        tabledata = []

        for data in cv['knowledge_graph']:
            items = []
            for v in data['values']:
                items.append(Paragraph(f"{v}", style=bulletStyle))
                items.append(Spacer(1, mm))
            tabledata.append([
                Paragraph(data["title"], style=paraStyle),
                items
            ])
        table = Table(
            tabledata,
            colWidths=[50*mm, None])
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('ALIGN',(0,0),(-1,-1),'LEFT'),
            ('TOPPADDING',(0,0),(-1,-1),4*mm),
        ]))
        paragraphs = [
            Spacer(1, 8*mm),
            Paragraph("IT-Knowledge", style=titleStyle),
            self.sectionLine(),
            Paragraph("+++ excellent knowledge, acquired through years of project work", style=definitionStyle),
            Paragraph("++ very good knowledge, acquired through at least one longer project assignment", style=definitionStyle),
            Paragraph("+ basic knowledge, e.g. through prototypes or occasional use", style=definitionStyle),
            table
        ]
        return paragraphs

    def osEngagement(self, cv):
        table = Table(
            [
                [
                    Paragraph("GitHub", style=paraStyle),
                    Paragraph("https://github.com/nirnanaaa", style=paraStyle),
                ]
            ],
            colWidths=[50*mm, None])
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('ALIGN',(0,0),(-1,-1),'LEFT'),
            ('TOPPADDING',(0,0),(-1,-1),4*mm),
        ]))
        paragraphs = [
            Spacer(1, 8*mm),
            Paragraph("Links", style=titleStyle),
            self.sectionLine(),
            table
        ]
        return paragraphs

    def pageOverview(self, cv):
        tabledata = []

        for data in cv['faq_sheet']:
            items = []
            for v in data['values']:
                items.append(Paragraph(f"{v}", style=bulletStyle))
                items.append(Spacer(1, 1*mm))
            tabledata.append([
                Paragraph(data["title"], style=paraStyle),
                items
            ])
        table = Table(
            tabledata,
            colWidths=[50*mm, None])
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('ALIGN',(0,0),(-1,-1),'LEFT'),
            ('TOPPADDING',(0,0),(-1,-1),4*mm),
        ]))
        paragraphs = [
            Paragraph(cv['introduction'], style=styles["Normal"]),
            Spacer(1, 5*mm),
            table
        ]
        return paragraphs

    def create(self, cv, output_file):
        c = SimpleDocTemplate(output_file, pagesize=A4)
        flowables = [
            Spacer(1, 10*mm),
        ] + self.pageOverview(cv)
        flowables.append(PageBreak())
        flowables += self.skillsOverview(cv)
        flowables.append(PageBreak())
        flowables += self.projects(cv['history'])
        flowables += self.projects(cv['permanent_positions'], "Employment")
        flowables += self.osEngagement(cv)

        c.build(flowables, onFirstPage=self.layout, onLaterPages=self.layout)
