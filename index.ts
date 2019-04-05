import * as chromaprint from 'fpcalc';
import * as path from 'path';
import * as request from 'request';

const POSHETT_MB_URL = "http://localhost:3100";

type ChromaprintResult = {
	duration: number,
	chromaprint: string
};

function getChromaprint(filepath: string): Promise<ChromaprintResult> {
	return new Promise((resolve, reject) => {
		chromaprint(path.resolve(process.argv[2]), function(err, result) {
			if (err) {
				return reject(err);
			}

			result.chromaprint = result.fingerprint;
			console.log(result.duration, result.chromaprint);
			resolve(result);
		});
	});
}

function getCover(filepath: string): Promise<any> {
	return new Promise((resolve, reject) => {
		getChromaprint(filepath)
		.then((result: ChromaprintResult) => {
			const options = {
				headers: { 
					'content-type' : 'application/x-www-form-urlencoded'
				},
				url: POSHETT_MB_URL + '/chromaprint',
				json: {
					chromaprint: result.chromaprint,
					duration: result.duration
				}
			}

			request.post(options, (error, response, body) => {
				console.log(body);
				resolve(body);
			});
		});
	});
}

module.exports = getCover;
