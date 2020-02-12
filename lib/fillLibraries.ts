import keyframesLibrary from './keyframesLibrary';
import selectorsLibrary from './selectorsLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';
import extractFromHtml from './helpers/extractFromHtml';
import { BaseLibraryOptions } from './baseLibrary';

export default (code: string | Buffer, opts: BaseLibraryOptions = {}): void => {
  const defaultOptions = {
    codeType: 'css', // 'css' | 'html'
    ignoreAttributeSelectors: false,
    ignoreCssVariables: false,
    replaceKeyframes: false,
    prefix: '',
    suffix: '',
  };

  const options = { ...defaultOptions, ...opts };
  let cssCode = code;

  if (options.codeType === 'html') {
    const htmlExtractedCss = extractFromHtml(code.toString());

    // no css code found to fill
    if (htmlExtractedCss.length <= 0) {
      return;
    }

    cssCode = htmlExtractedCss.join(' ');
  }

  const data = cssCode.toString();

  selectorsLibrary.setPrefix(options.prefix);
  selectorsLibrary.setSuffix(options.suffix);

  if (!options.ignoreAttributeSelectors) {
    selectorsLibrary.setAttributeSelector(data);
  }

  if (options.replaceKeyframes) {
    keyframesLibrary.fillLibrary(data);
  }

  if (!options.ignoreCssVariables) {
    cssVariablesLibrary.fillLibrary(data);
  }

  selectorsLibrary.fillLibrary(data, options);
};