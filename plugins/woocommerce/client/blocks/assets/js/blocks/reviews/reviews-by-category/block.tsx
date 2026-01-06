/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	Placeholder,
	ToggleControl,
	withSpokenMessages,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanel as ToolsPanel,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import ProductCategoryControl from '@woocommerce/editor-components/product-category-control';
import { Icon, commentContent } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import EditorContainerBlock from '../editor-container-block';
import NoReviewsPlaceholder from './no-reviews-placeholder';
import {
	getBlockControls,
	getSharedReviewContentControls,
	getSharedReviewListControls,
} from '../edit-utils.js';
import type { ReviewsByCategoryEditorProps } from './types';

const DEFAULT_ATTRIBUTES = {
	categoryIds: [],
	showProductName: true,
	showReviewRating: true,
	showReviewerName: true,
	showReviewImage: true,
	showReviewDate: true,
	showReviewContent: true,
	imageType: 'reviewer',
	showOrderby: true,
	orderby: 'most-recent',
	reviewsOnPageLoad: 10,
	showLoadMore: true,
	reviewsOnLoadMore: 10,
};

/**
 * Component to handle edit mode of "Reviews by Category".
 *
 * @param {Object}            props                Incoming props for the component.
 * @param {Object}            props.attributes     Incoming block attributes.
 * @param {function(any):any} props.debouncedSpeak
 * @param {function(any):any} props.setAttributes  Setter for block attributes.
 */
const ReviewsByCategoryEditor = ( {
	attributes,
	debouncedSpeak,
	setAttributes,
}: ReviewsByCategoryEditorProps ) => {
	const { editMode, categoryIds } = attributes;

	const getInspectorControls = () => {
		return (
			<InspectorControls key="inspector">
				<ToolsPanel
					label={ __( 'Category', 'woocommerce' ) }
					resetAll={ () =>
						setAttributes( {
							categoryIds: DEFAULT_ATTRIBUTES.categoryIds,
						} )
					}
				>
					<ToolsPanelItem
						hasValue={ () =>
							JSON.stringify( attributes.categoryIds ) !==
							JSON.stringify( DEFAULT_ATTRIBUTES.categoryIds )
						}
						label={ __( 'Categories', 'woocommerce' ) }
						onDeselect={ () =>
							setAttributes( {
								categoryIds: DEFAULT_ATTRIBUTES.categoryIds,
							} )
						}
						isShownByDefault
					>
						<ProductCategoryControl
							selected={ attributes.categoryIds }
							onChange={ ( value = [] ) => {
								const ids = value.map( ( { id } ) => id );
								setAttributes( { categoryIds: ids } );
							} }
							isCompact={ true }
							showReviewCount={ true }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				<ToolsPanel
					label={ __( 'Content', 'woocommerce' ) }
					resetAll={ () =>
						setAttributes( {
							showProductName: DEFAULT_ATTRIBUTES.showProductName,
							showReviewRating:
								DEFAULT_ATTRIBUTES.showReviewRating,
							showReviewerName:
								DEFAULT_ATTRIBUTES.showReviewerName,
							showReviewImage: DEFAULT_ATTRIBUTES.showReviewImage,
							showReviewDate: DEFAULT_ATTRIBUTES.showReviewDate,
							showReviewContent:
								DEFAULT_ATTRIBUTES.showReviewContent,
							imageType: DEFAULT_ATTRIBUTES.imageType,
						} )
					}
				>
					<ToolsPanelItem
						label={ __( 'Product name', 'woocommerce' ) }
						hasValue={ () =>
							attributes.showProductName !==
							DEFAULT_ATTRIBUTES.showProductName
						}
						onDeselect={ () =>
							setAttributes( {
								showProductName:
									DEFAULT_ATTRIBUTES.showProductName,
							} )
						}
						isShownByDefault
					>
						<ToggleControl
							label={ __( 'Product name', 'woocommerce' ) }
							checked={ attributes.showProductName }
							onChange={ () =>
								setAttributes( {
									showProductName:
										! attributes.showProductName,
								} )
							}
						/>
					</ToolsPanelItem>
					{ getSharedReviewContentControls(
						attributes,
						setAttributes
					) }
				</ToolsPanel>
				<ToolsPanel
					label={ __( 'List Settings', 'woocommerce' ) }
					resetAll={ () =>
						setAttributes( {
							showOrderby: DEFAULT_ATTRIBUTES.showOrderby,
							orderby: DEFAULT_ATTRIBUTES.orderby,
							reviewsOnPageLoad:
								DEFAULT_ATTRIBUTES.reviewsOnPageLoad,
							showLoadMore: DEFAULT_ATTRIBUTES.showLoadMore,
							reviewsOnLoadMore:
								DEFAULT_ATTRIBUTES.reviewsOnLoadMore,
						} )
					}
				>
					{ getSharedReviewListControls( attributes, setAttributes ) }
				</ToolsPanel>
			</InspectorControls>
		);
	};

	const renderEditMode = () => {
		const onDone = () => {
			setAttributes( { editMode: false } );
			debouncedSpeak(
				__(
					'Now displaying a preview of the reviews for the products in the selected categories.',
					'woocommerce'
				)
			);
		};

		return (
			<Placeholder
				icon={
					<Icon
						icon={ commentContent }
						className="block-editor-block-icon"
					/>
				}
				label={ __( 'Reviews by Category', 'woocommerce' ) }
				className="wc-block-reviews-by-category"
			>
				{ __(
					'Show product reviews from specific categories.',
					'woocommerce'
				) }
				<div className="wc-block-reviews__selection">
					<ProductCategoryControl
						selected={ attributes.categoryIds }
						onChange={ ( value = [] ) => {
							const ids = value.map( ( { id } ) => id );
							setAttributes( { categoryIds: ids } );
						} }
						showReviewCount={ true }
					/>
					<Button variant="primary" onClick={ onDone }>
						{ __( 'Done', 'woocommerce' ) }
					</Button>
				</div>
			</Placeholder>
		);
	};

	if ( ! categoryIds || editMode ) {
		return renderEditMode();
	}

	const buttonTitle = __( 'Edit selected categories', 'woocommerce' );

	return (
		<>
			{ getBlockControls( editMode, setAttributes, buttonTitle ) }
			{ getInspectorControls() }
			<EditorContainerBlock
				attributes={ attributes }
				icon={
					<Icon
						icon={ commentContent }
						className="block-editor-block-icon"
					/>
				}
				name={ __( 'Reviews by Category', 'woocommerce' ) }
				noReviewsPlaceholder={ NoReviewsPlaceholder }
			/>
		</>
	);
};

export default withSpokenMessages( ReviewsByCategoryEditor );
