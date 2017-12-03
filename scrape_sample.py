import sys
import requests
import re
import json
import urllib.request
from bs4 import BeautifulSoup,Tag

args = sys.argv

for line in open(args[1], 'r'):
	url = line;
	USER_AGENT='Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
	ua = {'User-Agent': USER_AGENT}
	res = requests.get(url, headers=ua)
	soup = BeautifulSoup(res.content, 'html.parser')
	
	# set target
	js = soup.body.find("div",attrs={"class":"xxx"}).script.text
	
	data = js[js.find("({")+1:js.rfind("})")+1];
	jsn = json.loads(data);
	print(jsn);