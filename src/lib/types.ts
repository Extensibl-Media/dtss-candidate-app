export interface AddressResult {
	place_name: string;
	formatted_address: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	context?: {
		country?: string;
		region?: string;
		district?: string;
		postcode?: string;
		locality?: string; // City/town
		neighborhood?: string;
		street?: string;
	};
	address_components?: {
		street_number?: string;
		street_name?: string;
		subpremise?: string; // Suite/apartment number
		premise?: string; // Building name
		secondary_address?: string; // Unit, suite, apt, etc.
		address_line1?: string;
		address_line2?: string;
	};
	place_id: string;
	place_type?: string[];
	raw_properties?: any; // For debugging - you can remove this in production
}
