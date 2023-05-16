UNO_PATH=/Applications/LibreOffice.app/Contents
export

cv:
	pipenv run python gen.py
new-cv:
	cargo run