import reportlab
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import os
from reportlab.platypus import SimpleDocTemplate, PageBreak, Paragraph, Spacer, TableStyle, Table
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
        c.rect(0, PAGE_HEIGHT-80, PAGE_WIDTH, 80, 0, 1)
        
        c.setFillColorRGB(19, 22, 38)
        #c.setFillColorRGB(255, 255, 255)
        c.setFont("Montserrat-Regular", 20)
        
        c.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-30, "Florian Kasper")
        c.setFillColorRGB(242, 183, 5)
        c.setFont("Montserrat-Regular", 13)
        c.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, "Software and DevOps Engineer")
        c.setFont("Montserrat-Regular", 7)
        c.drawCentredString(45*mm, PAGE_HEIGHT-70, "info@florian-kasper.com")
        c.drawCentredString(PAGE_WIDTH/2, PAGE_HEIGHT-70, "+49 1516 7522873")
        c.drawCentredString(PAGE_WIDTH-45*mm, PAGE_HEIGHT-70, "florian-kasper.com")

        c.restoreState()
    def projects(self, history):
        tabledata = []

        for data in history:
            items = []
            items.append(Paragraph(f"{data['role']} for {data['client']}", style=boldStyle))
            items.append(Spacer(1, mm))
            keypoints = []
            for kp in data['key_points']:
                keypoints.append(Paragraph(f"{kp}", style=bulletStyle))

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
            ('VALIGN',(0,0),(5,20),'TOP'),
            ('ALIGN',(0,0),(5,20),'LEFT'),
            ('TOPPADDING',(0,0),(5,20),5 * mm),
        ]))
        paragraphs = [
            Spacer(1, 10*mm),
            Paragraph("Project History", style=titleStyle),
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
            ('VALIGN',(0,0),(5,20),'TOP'),
            ('ALIGN',(0,0),(5,20),'LEFT'),
            ('TOPPADDING',(0,0),(5,20),5 * mm),
        ]))
        paragraphs = [
            Spacer(1, 10*mm),
            Paragraph("IT-Knowledge", style=titleStyle),
            Paragraph("+++ excellent Knowledge, acquired through years of project work", style=definitionStyle),
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
            ('VALIGN',(0,0),(5,20),'TOP'),
            ('ALIGN',(0,0),(5,20),'LEFT'),
            ('TOPPADDING',(0,0),(5,20),5 * mm),
        ]))
        paragraphs = [
            Spacer(1, 10*mm),
            Paragraph("Project History", style=titleStyle),
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
            ('VALIGN',(0,0),(5,20),'TOP'),
            ('ALIGN',(0,0),(5,20),'LEFT'),
            ('TOPPADDING',(0,0),(5,20),5 * mm),
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
        ] + self.pageOverview(cv) + [PageBreak()] + self.skillsOverview(cv) + [PageBreak()] + self.projects(cv['history']) + [PageBreak()]

        flowables += self.projects(cv['permanent_positions'])
        flowables.append(PageBreak())
        flowables += self.osEngagement(cv)
        

        c.build(flowables, onFirstPage=self.layout, onLaterPages=self.layout)

