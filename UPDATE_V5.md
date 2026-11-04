# V5 — English interface and balanced layout

Changes requested:
- Removed the top status note, model/data explanation panel, motion-source captions, animation provenance chips and software-rendering label from the user interface.
- Motion labels, tooltips, empty-state prompts and search placeholder now use English. Chinese search aliases remain supported internally.
- Removed Liu Lab from the header, footer and page title.
- Added the full NUS logo image (crest plus namestyle), served locally from public/branding/nus-logo.webp.
- Unified all interface typography to Arial, including the charts and node labels.
- Kept side-column widths; constrained the desktop workspace to 1360px and made all three panels share the same top and bottom edges. The central canvas fills the space above its controls without a dead area below the playback bar.

GitHub update from V4:
1. Upload the new index.html to the repository root.
2. Upload the full new src folder, replacing same-name files.
3. Upload the new public/branding folder into the repository's public folder. Confirm public/branding/nus-logo.webp exists.
4. Commit and wait for the existing GitHub Actions deployment. Refresh the published page.

The model, catalog, signal generation, 100 motions and tests are unchanged. Scientific generation details remain in the project documentation; their removal from the main interface does not change the data source or its validation status.
