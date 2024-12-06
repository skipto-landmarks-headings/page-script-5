      { id: 'highlight-legend',         label: 'options_highlight_legend'},
      { id: 'highlight-disabled-label', label: 'options_highlight_disabled_label'},
      { id: 'highlight-instant-label',  label: 'options_highlight_instant_label'},
      { id: 'highlight-smooth-label',   label: 'options_highlight_smooth_label'},

      { id: 'headings-legend', label: 'options_heading_legend'},

      { id: 'headings-1-label', label: 'options_heading_h1'},
      { id: 'headings-2-label', label: 'options_heading_h2'},
      { id: 'headings-3-label', label: 'options_heading_h3'},
      { id: 'headings-4-label', label: 'options_heading_h4'},
      { id: 'headings-5-label', label: 'options_heading_h5'},
      { id: 'headings-6-label', label: 'options_heading_h6'},

      { id: 'headings-main-only-label', label: 'options_heading_main_only'},

      { id: 'landmarks-legend',              label: 'options_landmark_legend'},
      { id: 'landmarks-banner-label',        label: 'options_landmark_banner'},
      { id: 'landmarks-complementary-label', label: 'options_landmark_complementary'},
      { id: 'landmarks-contentinfo-label',   label: 'options_landmark_contentinfo'},
      { id: 'landmarks-navigation-label',    label: 'options_landmark_navigation'},
      { id: 'landmarks-search-label',        label: 'options_landmark_search'},
      { id: 'landmarks-region-label',        label: 'options_landmark_region'},
      { id: 'landmarks-doc-order',           label: 'options_landmark_doc_order'}

      form.highlightDisabled.checked = options.highlightTarget === 'disabled';
      form.highlightInstant.checked  = options.highlightTarget === 'instant';
      form.highlightSmooth.checked   = options.highlightTarget === 'smooth';

      form.landmarksNavigationInput.checked    = options.landmarks.includes('nav');
      form.landmarksSearchInput.checked        = options.landmarks.includes('search');
      form.landmarksComplementaryInput.checked = options.landmarks.includes('complementary');
      form.landmarksContentinfoInput.checked   = options.landmarks.includes('contentinfo');
      form.landmarksBannerInput.checked        = options.landmarks.includes('banner');
      form.landmarksRegionInput.checked        = options.landmarks.includes('region');

      form.landmarksDocOrderInput.checked      = options.landmarks.includes('doc-order');

      form.headings1Input.checked = options.headings.includes('h1');
      form.headings2Input.checked = options.headings.includes('h2');
      form.headings3Input.checked = options.headings.includes('h3');
      form.headings4Input.checked = options.headings.includes('h4');
      form.headings5Input.checked = options.headings.includes('h5');
      form.headings6Input.checked = options.headings.includes('h6');

      form.headingsMainOnlyInput.checked = options.headings.includes('main-only');
