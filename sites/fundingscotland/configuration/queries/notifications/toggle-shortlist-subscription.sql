{{#if @root.data.auth ~}}
CALL _toggleSubscriptionActiveState(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.shortlistCampaignName '-' @root.data.currentSite.name)}}},
  'Shortlist'
);
{{else}}
SET @query=false;
{{/if ~}}