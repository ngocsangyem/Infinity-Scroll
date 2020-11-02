const imageContainer = document.getElementById('images-container');
const loader = document.getElementById('loader');
let photos: Photo[] = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

const count = 10;
const API_KEY = '3KRYESIZ6XssORxi8LShzbcW3i_--TFKLkxo_xjBleg';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${count}`;

interface Exif {
	aperture: string;
	exposure_time: string;
	focal_length: string;
	iso: number;
	make: string;
	model: string;
}

interface Links {
	download: string;
	download_location: string;
	html: string;
	self: string;
}

interface Location {
	city: string;
	country: string;
	name: string;
	position: { latitude: number; longitude: number };
	title: string;
}

interface Urls {
	full: string;
	raw: string;
	regular: string;
	small: string;
	thumb: string;
}

interface User {
	accepted_tos: boolean;
	bio: string;
	first_name: string;
	id: string;
	instagram_username: string;
	last_name: string;
	links: {
		self: string;
		html: string;
		photos: string;
		likes: string;
		portfolio: string;
		followers: string;
		following: string;
	};
	location: string;
	name: string;
	portfolio_url: string;
	profile_image: {
		small: string;
		medium: string;
		large: string;
	};
	total_collections: number;
	total_likes: number;
	total_photos: number;
	twitter_username: null;
	updated_at: Date;
	username: string;
}

interface Photo {
	alt_description: string;
	blur_hash: string;
	categories: string[];
	color: string;
	created_at: Date;
	current_user_collections: [];
	description: string;
	downloads: number;
	exif: Exif;
	height: number;
	id: string;
	liked_by_user: boolean;
	likes: number;
	links: Links;
	location: Location;
	promoted_at: Date;
	sponsorship: string;
	updated_at: Date;
	urls: Urls;
	user: User;
	views: number;
	width: number;
}

function imageLoaded() {
	imagesLoaded++;
	if (imagesLoaded === totalImages) {
		loader.hidden = true;
		ready = true;
	}
}

function setAttributes(
	element: HTMLElement,
	attributes: { [key: string]: string }
) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

function displayPhoto() {
	imagesLoaded = 0;
	totalImages = photos.length;
	photos.forEach((photo: Photo) => {
		const { links, urls } = photo;
		const item = document.createElement('a');
		const image = document.createElement('img');

		setAttributes(item, {
			href: links.html,
			target: '_blank',
		});
		setAttributes(image, {
			src: urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description,
		});

		image.addEventListener('load', imageLoaded);

		item.appendChild(image);
		imageContainer?.appendChild(item);
	});
}

async function getPhotos() {
	try {
		const response = await fetch(apiUrl);
		photos = await response.json();
		displayPhoto();
		console.log('getPhotos -> data', photos);
	} catch (error) {
		console.log(error);
	}
}

window.addEventListener('scroll', () => {
	if (
		window.innerHeight + window.scrollY >=
			document.body.offsetHeight - 1000 &&
		ready
	) {
		ready = false;
		getPhotos();
	}
});

getPhotos();
