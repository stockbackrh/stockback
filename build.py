import re,glob
head=open('_head.html').read(); top=open('_topbar.html').read(); foot=open('_foot.html').read()
for f in glob.glob('*.html'):
    if f.startswith('_'): continue
    s=open(f).read()
    if '<!--#' not in s and 'data-nav' not in s and f!='index.html': continue
    s=s.replace('<!--#head-->',head)
    m=re.search(r'<!--#topbar:(\w+)-->',s)
    if m:
        key=m.group(1); t=top
        t=re.sub(r'<a class="navlink" href="([^"]+)" data-nav="'+key+'">([^<]+)</a>', r'<span class="navlink is-on">\2</span>', t)
