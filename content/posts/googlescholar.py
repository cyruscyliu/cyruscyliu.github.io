#!/usr/bin/python3

##
# python3 -m pip install bs4
##

from bs4 import BeautifulSoup

with open('csranking-latest.html') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

print('name,url of google scholar,numer of publications')
divs = soup.select('div[id$="-faculty"]')
for div in divs:
    table = div.find('table')
    tbody = table.find('tbody')
    if tbody:
        for row in tbody.find_all('tr'):
            if row.select('div[id$="-chart"]'):
                continue
            cells = row.find_all('td')
            name, google_scholar, num_of_pub = None, None, None
            for a in cells[1].find_all('a'):
                if 'title' in a.attrs:
                    if a.attrs['title'].find('home page') != -1 and name is None:
                        name = a.get_text(strip=True)
                    if a.attrs['title'].find('Google Scholar page') != -1:
                        google_scholar = a.attrs['href'].strip()
            for a in cells[2].find_all('a'):
                num_of_pub = int(a.get_text(strip=True))
            if num_of_pub is None:
                continue
            if num_of_pub >= 18:
                print('{},{},{}'.format(name.replace('\t', '').replace('\n', ' '), google_scholar, num_of_pub))
