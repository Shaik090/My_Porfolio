from pathlib import Path
import shutil
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader
import pymupdf

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/Shaik_Mohammad_Nowman_Resume.pdf'
for name,file in [('Arial','arial.ttf'),('Arial-Bold','arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold',italic='Arial',boldItalic='Arial-Bold')
W,H=A4
NAVY='#303b4c'; BLUE='#2879a6'; INK='#303b4c'; MUTED='#46616d'
c=canvas.Canvas(str(OUT),pagesize=A4)
c.setTitle('Shaik Mohammad Nowman - Software Developer Resume')
c.setAuthor('Shaik Mohammad Nowman')
c.setSubject('Software developer resume - web and Android application projects')
c.setFillColor(HexColor(NAVY)); c.rect(0,H-163,W,163,fill=1,stroke=0)
c.setFillColor(HexColor(BLUE)); c.rect(0,0,202,H-163,fill=1,stroke=0)
x=32; width=W-64; y=H-30

def para(text,size=10,leading=14,bold=False,color=INK,after=5):
    global y
    p=Paragraph(text,ParagraphStyle('p',fontName='Arial-Bold' if bold else 'Arial',fontSize=size,leading=leading,textColor=HexColor(color)))
    _,h=p.wrap(width,1000)
    p.drawOn(c,x,y-h)
    y-=h+after

def section(label,side=False):
    global y
    para(label,14,18,True,'#ffffff' if side else NAVY,7)
    c.setStrokeColor(HexColor('#d1e4ed' if side else NAVY)); c.setLineWidth(.8)
    c.line(x,y,x+width,y); y-=9 if side else 13

def bullet(text):
    global y
    p=Paragraph(text,ParagraphStyle('bullet',fontName='Arial',fontSize=10,leading=14,textColor=HexColor(INK)))
    _,h=p.wrap(width-10,1000)
    c.setFillColor(HexColor(INK)); c.circle(x+2,y-5,1.2,fill=1,stroke=0)
    p.drawOn(c,x+10,y-h); y-=h+5

para('Shaik Mohammad',28,33,True,'#ffffff',0)
para('Nowman',36,41,False,'#ffffff',9)
para('SOFTWARE DEVELOPER',11,15,True,'#ffffff',3)
para('Web &amp; Mobile Applications',10,14,False,'#d8e6f1',0)

# Draw each column in reading order; all text remains selectable.
x=26; width=150; y=H-186
section('Contact',True)
for title,value in [
 ('Location','Andhra Pradesh, India'),
 ('LinkedIn','<link href="https://www.linkedin.com/in/shaik-nowman" color="#ffffff">LinkedIn profile</link>'),
 ('Email','<link href="mailto:shaiknowman99@gmail.com" color="#ffffff">shaiknowman99@gmail.com</link>')]:
    para(title,10,13,True,'#ffffff',1)
    para(value,9.6,12,color='#ffffff',after=7)
y-=0
section('Education',True)
para('B.Tech - Computer Science &amp; Engineering',10,13,True,'#ffffff',4)
para('Rajeev Gandhi Memorial College of Engineering, Nandyal',9.6,12,color='#ffffff',after=4)
para('2025 | CGPA: 7.44',9.6,12,color='#ffffff',after=8)
para('Intermediate - MPC',10,13,True,'#ffffff',3)
para('Narayana Junior College, Tirupati',9.6,12,color='#ffffff',after=3)
para('2018 | 94.7%',9.6,12,color='#ffffff',after=8)
para('SSC / Class 10',10,13,True,'#ffffff',3)
para('Viswa Bharathi High School, Punganur',9.6,12,color='#ffffff',after=3)
para('2016 | CGPA: 8.2',9.6,12,color='#ffffff',after=12)
section('Technical Skills',True)
for title,value in [
 ('Languages','Java, Python, JavaScript, TypeScript, SQL'),
 ('Frontend','React.js, Next.js, HTML5, CSS3, EJS'),
 ('Backend &amp; Database','Node.js, Express.js, REST APIs, MongoDB'),
 ('Tools','Git, GitHub, VS Code, npm, Android Emulator, ADB, Render; AI-assisted development'),
 ('Testing','Functional testing')]:
    para(title,10,13,True,'#ffffff',1)
    para(value,9.6,12,color='#ffffff',after=6)
assert y>=22, f'Sidebar overflow: {y}'
side_bottom=y

x=225; width=W-x-27; y=H-186
section('Professional Summary')
para('Computer Science graduate with project experience building web and Android applications using Next.js, TypeScript, Node.js and MongoDB. Develops practical workflows, integrates REST APIs and performs functional testing. Seeking an entry-level software development opportunity.',10,14,after=13)
section('Projects')

def project(title,stack,points):
    para(title,11,15,True,after=3)
    para(stack,9.5,13,color=BLUE,after=6)
    for text in points: bullet(text)
    global y
    y-=7

project('BillSahi | Business Management Software','Next.js, TypeScript, MongoDB, React Native',[
 'Developed web and Android applications to support daily business operations.',
 'Defined user-scoped MongoDB indexes for stock and sales queries, with unique invoice numbers per user.',
 'Desktop application is under development.'
])
project('Cafe Flex | Cafe Management','React Native, Android, Local Wi-Fi',[
 'Built an Android POS with TCP-based local networking, heartbeat checks and capped reconnection backoff.',
 'Persisted pending staff commands locally and flushed the queue after reconnecting.'
])
project('Personal Portfolio | nowman.site','Next.js, React.js, TypeScript, CSS',[
 'Designed and built a responsive developer portfolio to showcase projects, technical skills, education and certifications.',
 'Created interactive project cards, mobile navigation and a downloadable resume.',
 'Portfolio: <link href="https://nowman.site" color="#2879a6">https://nowman.site</link>'
])
section('Certifications')
para('Full Stack Development',10,14,True,after=1)
para('Apna College',10,14,color=MUTED,after=8)
para('Python for Beginners',10,14,True,after=1)
para('Cisco Networking Academy',10,14,color=MUTED,after=0)
assert y>=22, f'Main column overflow: {y}'
c.save()
r=PdfReader(OUT)
assert len(r.pages)==1
text=r.pages[0].extract_text()
for term in ['Shaik Mohammad','Nowman','BillSahi','Cafe Flex','nowman.site','Next.js','React.js','shaiknowman99@gmail.com','Certifications','under development']:
    assert term in text,term
assert '7093432326' not in text
assert '(learning)' not in text
assert '\ufffd' not in text
assert 'WanderIn' not in text and 'Crime Zone' not in text
for f in r.pages[0]['/Resources']['/Font'].values():
    f=f.get_object()
    if '/FontDescriptor' in f:
        assert '/FontFile2' in f['/FontDescriptor']
shutil.copyfile(OUT,ROOT/'public/resume.pdf')
(ROOT/'tmp/pdfs/resume-extracted.txt').write_text(text,encoding='utf-8')
pdf=pymupdf.open(OUT)
pdf[0].get_pixmap(matrix=pymupdf.Matrix(1.7,1.7)).save(ROOT/'tmp/pdfs/resume-preview.png')
print(f'Created one-page resume; sidebar bottom {side_bottom:.1f}pt, main bottom {y:.1f}pt; text and font checks passed.')
