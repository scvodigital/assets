{{#if @root.data.auth ~}}
CALL _toggleSubscriptionActiveState(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.emailCampaignName '-' @root.data.currentSite.name)}}},
  {{{mysqlEscape @root.request.body.name}}}
);
{{else}}
SET @query=false;
{{/if ~}}