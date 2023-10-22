import { RadioGarden } from '../lib/radio-garden';

const rg = new RadioGarden();

async function test() {
	const geo = await rg.geo();
	console.log('Geo:', geo);

	const search = await rg.search('Tokyo');
	console.log('Search:', search[0]);

	const places = await rg.getPlaces();
	const firstPlace = places[0];
	console.log('First-place:', firstPlace);
	if (firstPlace) {
		const page = await rg.getPageByPlaceId(firstPlace.id);
		page.content = [];
		console.log('Place-ID:', page);
	}

    const radioID = 'XehO7lZ3';
    const channel = await rg.getChannelById(radioID);
    console.log('Channel-ID:', channel);

    console.log('redirect:', await rg.listen(radioID));
}

test();
