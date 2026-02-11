from reportlab.lib.styles import ParagraphStyle, StyleSheet1
from reportlab.lib.colors import Color

def getSampleStyleSheet():
    """Returns a stylesheet using Plus Jakarta Sans fonts"""
    stylesheet = StyleSheet1()

    stylesheet.add(ParagraphStyle(name='Normal',
                                  fontName="PlusJakartaSans-Regular",
                                  fontSize=10,
                                  leading=12)
                   )
    stylesheet.add(ParagraphStyle(name='Small',
                                  fontName="PlusJakartaSans-SemiBoldItalic",
                                  parent=stylesheet['Normal'],
                                  fontSize=7)
                   )
    stylesheet.add(ParagraphStyle(name='BodyText',
                                  parent=stylesheet['Normal'],
                                  spaceBefore=6)
                   )
    stylesheet.add(ParagraphStyle(name='SectionTitle',
                                  parent=stylesheet['Normal'],
                                  fontName="PlusJakartaSans-SemiBold",
                                  fontSize=12,
                                  leading=14,
                                  spaceBefore=12,
                                  spaceAfter=6,
                                  keepWithNext=1),
                   alias='h3')
    stylesheet.add(ParagraphStyle(name='RoleTitle',
                                  parent=stylesheet['Normal'],
                                  fontName="PlusJakartaSans-SemiBold",
                                  fontSize=9,
                                  leading=10.8,
                                  spaceBefore=8,
                                  spaceAfter=4),
                   alias='h5')
    stylesheet.add(ParagraphStyle(name='Bullet',
                                  parent=stylesheet['Normal'],
                                  firstLineIndent=0,
                                  spaceBefore=4),
                   alias='bu')
    stylesheet.add(ParagraphStyle(name='Tech',
                                  parent=stylesheet['Normal'],
                                  fontName="PlusJakartaSans-Italic",
                                  fontSize=8,
                                  leading=10,
                                  textColor=Color(0.4, 0.4, 0.4),
                                  spaceBefore=1),
                   alias='tech')
    stylesheet.add(ParagraphStyle(name='Definition',
                                  parent=stylesheet['Normal'],
                                  firstLineIndent=0,
                                  leftIndent=36,
                                  bulletIndent=0,
                                  spaceBefore=6,
                                  bulletFontName="PlusJakartaSans-SemiBoldItalic"),
                   alias='df')
    return stylesheet
