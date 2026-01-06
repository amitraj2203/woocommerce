/**
 * Internal dependencies
 */
import { SharedReviewAttributes } from '../types';

interface ReviewsByCategoryAttributes extends SharedReviewAttributes {
	editMode: boolean;
	categoryIds: number[];
	showProductName: boolean;
}

export interface ReviewsByCategoryEditorProps {
	attributes: ReviewsByCategoryAttributes;
	setAttributes: (
		attributes: Partial< ReviewsByCategoryAttributes >
	) => void;
	debouncedSpeak: ( message: string ) => void;
}
