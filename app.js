#!/usr/bin/env node

const yargs = require('yargs')
const axios = require('axios')


const argv = yargs.options({
	'a':{
		demand: true,
		alias: 'address', 
		default: 'London',
		
		describe: 'Address to fetch weather for ',
		string: true,
	}
})

.help()
.alias('help', 'h')
.argv;

let encodedAddress = (argv.address)
let geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=vkDHXzlLG0er9G0mAKXCk1UPN4213zwA&location=${encodedAddress}`

axios.get(geocodeUrl).then((response) =>{
	if (response.data.info.statuscode === 400){
		throw new Error('Unable to find that address')
	}

	let latitude = response.data.results[0].locations[0].latLng.lat
	let longitude = response.data.results[0].locations[0].latLng.lng
	weatherUrl = `https://api.darksky.net/forecast/31d62bebec32e0206831a5a1dc9bfcd7/${latitude},${longitude}`
	console.log(response.data.results[0].locations[0].adminArea5)
	return axios.get(weatherUrl)
}).then((response) =>{
	let temperature = Math.floor((response.data.currently.temperature - 32) * 5/9)
	let apparentTemperature = Math.floor((response.data.currently.apparentTemperature -32) *5/9)
	console.log(`It's currently ${temperature}˚C. It feels like ${apparentTemperature}˚C.`)
}).catch((e) =>{

	if (e.code === 'ENOTFOUND'){
		console.log('Unable to connect to API server')
	}else{
		console.log(e.message)
	}
})



