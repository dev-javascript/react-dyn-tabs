import resizeDetectorIns from './element-resize-detector-adapter.js';
import MoreButton from './more-button.js';
const ShowMoreTabs = MoreButton.bind(null, resizeDetectorIns);
export default function ResponsiveFactory(ctx, useScroll = false) {
  useScroll === true ? new ShowMoreTabs(ctx) : new ShowMoreTabs(ctx);
}
