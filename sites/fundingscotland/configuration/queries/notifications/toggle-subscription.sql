{{#if @root.data.auth ~}}
CALL _toggleSubscriptionActiveState(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.emailCampaignName '-' @root.data.currentSite.name)}}},
  {{{mysqlEscape @root.request.params.query.name}}}
);
{{else}}
SET @query=false;
{{/if ~}}