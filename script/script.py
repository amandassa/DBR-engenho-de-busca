import nltk
nltk.download('stopwords')
stopwords = nltk.corpus.stopwords.words('portuguese')
f = open("stopwords.json", "a")
f.write('{"words":[')
for word in stopwords:
	f.write(f'"{word}", ')
f.write(']}')
f.close()
