<?php
declare( strict_types=1 );

/**
 * Tests for WC_Meta_Box_Product_Data class.
 */
class WC_Meta_Box_Product_Data_Test extends WC_Unit_Test_Case {

	/**
	 * Test that prepare_downloads automatically adds https:// protocol to URLs without a protocol.
	 *
	 * @dataProvider provider_prepare_downloads_url_protocol
	 *
	 * @param string $input_url The URL to test.
	 * @param string $expected_url The expected URL after processing.
	 * @param string $description Test description.
	 */
	public function test_prepare_downloads_url_protocol( string $input_url, string $expected_url, string $description ): void {
		$file_names  = array( 'Test File' );
		$file_urls   = array( $input_url );
		$file_hashes = array( 'test-hash-123' );

		// Use reflection to call the private prepare_downloads method.
		$reflection = new ReflectionClass( 'WC_Meta_Box_Product_Data' );
		$method     = $reflection->getMethod( 'prepare_downloads' );
		$method->setAccessible( true );

		$result = $method->invokeArgs( null, array( $file_names, $file_urls, $file_hashes ) );

		$this->assertIsArray( $result, 'prepare_downloads should return an array' );
		$this->assertCount( 1, $result, 'Should return one download' );
		$this->assertEquals( $expected_url, $result[0]['file'], $description );
	}

	/**
	 * Data provider for test_prepare_downloads_url_protocol.
	 *
	 * @return array[]
	 */
	public function provider_prepare_downloads_url_protocol(): array {
		return array(
			'URL without protocol'                => array(
				'example.com/file.pdf',
				'https://example.com/file.pdf',
				'Should prepend https:// to URLs without a protocol',
			),
			'URL with https protocol'             => array(
				'https://example.com/file.pdf',
				'https://example.com/file.pdf',
				'Should keep existing https:// protocol',
			),
			'URL with http protocol'              => array(
				'http://example.com/file.pdf',
				'http://example.com/file.pdf',
				'Should keep existing http:// protocol',
			),
			'URL with ftp protocol'               => array(
				'ftp://files.example.com/file.pdf',
				'ftp://files.example.com/file.pdf',
				'Should keep existing ftp:// protocol',
			),
			'URL with file protocol'              => array(
				'file:///uploads/file.pdf',
				'file:///uploads/file.pdf',
				'Should keep existing file:// protocol',
			),
			'URL with subdomain without protocol' => array(
				'cdn.example.com/downloads/file.pdf',
				'https://cdn.example.com/downloads/file.pdf',
				'Should prepend https:// to subdomain URLs without a protocol',
			),
			'URL with query string'               => array(
				'example.com/file.pdf?version=2',
				'https://example.com/file.pdf?version=2',
				'Should prepend https:// and preserve query string',
			),
			'URL with spaces'                     => array(
				'  example.com/file.pdf  ',
				'https://example.com/file.pdf',
				'Should trim spaces and prepend https://',
			),
		);
	}

	/**
	 * Test that prepare_downloads handles empty or invalid inputs gracefully.
	 */
	public function test_prepare_downloads_empty_inputs(): void {
		$reflection = new ReflectionClass( 'WC_Meta_Box_Product_Data' );
		$method     = $reflection->getMethod( 'prepare_downloads' );
		$method->setAccessible( true );

		// Test with empty arrays.
		$result = $method->invokeArgs( null, array( array(), array(), array() ) );
		$this->assertIsArray( $result );
		$this->assertCount( 0, $result, 'Should return empty array for empty inputs' );

		// Test with empty URL strings.
		$file_names  = array( 'Test File', '' );
		$file_urls   = array( '', '' );
		$file_hashes = array( 'hash1', 'hash2' );
		$result      = $method->invokeArgs( null, array( $file_names, $file_urls, $file_hashes ) );
		$this->assertIsArray( $result );
		$this->assertCount( 0, $result, 'Should skip empty URL strings' );
	}
}
