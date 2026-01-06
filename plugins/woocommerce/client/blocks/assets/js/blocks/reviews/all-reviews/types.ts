/**
 * Internal dependencies
 */
import { SharedReviewAttributes } from '../types';

interface AllReviewsAttributes extends SharedReviewAttributes {
	showProductName: boolean;
}

export interface AllReviewsEditorProps {
	attributes: AllReviewsAttributes;
	setAttributes: ( attributes: Partial< AllReviewsAttributes > ) => void;
	debouncedSpeak: ( message: string ) => void;
	idBase: unknown;
	instance: {
		raw: {
			number: number;
		};
	};
}
