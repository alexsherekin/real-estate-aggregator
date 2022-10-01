#!/bin/bash

curl 'https://service.berlin.de/terminvereinbarung/termin/day/' \
  -H 'authority: service.berlin.de' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'accept-language: en-GB,en;q=0.9,en-US;q=0.8,uk;q=0.7,ru;q=0.6,de;q=0.5' \
  -H 'cache-control: max-age=0' \
  -H 'cookie: zmsappointment-session=inProgress; Zmsappointment=pq9equgrl7kvao5nqnfms9emj0; wt_rla=102571513503709%2C36%2C1664641235770' \
  -H 'dnt: 1' \
  -H 'sec-ch-ua: "Microsoft Edge";v="105", " Not;A Brand";v="99", "Chromium";v="105"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: none' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.53' \
  --compressed > result.html

if grep -q 'An diesem Tag einen Termin buchen' 'result.html'; then
    mail -s 'FOUND' alexandr.sherekin@gmail.com
    echo found
else
    mail -s 'NOT FOUND' alexandr.sherekin@gmail.com
    echo not found
fi
