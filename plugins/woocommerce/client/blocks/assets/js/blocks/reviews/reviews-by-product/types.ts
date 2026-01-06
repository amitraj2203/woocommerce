/**
 * External dependencies
 */
import { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { SharedReviewAttributes } from '../types';

interface ReviewByProductAttributes extends SharedReviewAttributes {
	editMode: boolean;
	productId: number;
}

export interface ReviewsByProductEditorProps
	extends BlockEditProps< ReviewByProductAttributes > {
	attributes: ReviewByProductAttributes;
	debouncedSpeak: ( message: string ) => void;
}
