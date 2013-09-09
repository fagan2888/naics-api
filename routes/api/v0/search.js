
var naics_2007          = require(process.cwd() + '/data/naics-2007'),
	naics_2012          = require(process.cwd() + '/data/naics-2012')
var searchjs            = require('searchjs')


exports.get = function ( req, res ) {
	var query = req.query
	var naics_year,
		naics_desc

	if (query.year) {
		if (query.year == '2007' || query.year == '2012') {

			if (query.year == '2007') { naics_year = naics_2007 }
			if (query.year == '2012') { naics_year = naics_2012 }

			if (query.terms) {

				// have a complete array ready for search
				var collection = naics_year.items

				// create search objects from query
				var terms = query.terms

				var jsql = {_join: 'OR', title: terms, index: terms, description: terms, _text: true}

				// search using searchjs
				var matches = searchjs.matchArray(collection, jsql)

				// Send to user
				res.send(matches)

			}
			else {
				// no search terms provided
				returnError(400, 'Please include search terms.')
			}
		}
		if (query.year == '2002' || query.year == '1997') {
			returnError(404, 'NAICS API does not currently include ' + query.year + ' data.')
		}
		else {
			returnError(400, 'Please use a valid NAICS year.')
		}
	}
	else {
		returnError(400, 'Please include a NAICS year.')
	}

	function returnError (http_status, error_msg) {
		// Generic error message function
		res.send(http_status, {
			'http_status': http_status,
			'error_msg': error_msg
		})
	}

}

