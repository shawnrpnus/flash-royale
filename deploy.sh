cd front-end; npm run build
cd ../; cp -r front-end/build/* api/public/
scp -r api/[!node_modules]* flash@207.46.230.56:~/
cat remote.sh | ssh flash@207.46.230.56
