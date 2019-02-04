{{#if @root.data.auth ~}}
CALL _getSubscriptions(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.shortlistCampaignName '-' @root.data.currentSite.name)}}},
  {{{mysqlEscape @root.request.params.name}}}
);
{{else}}
SET @query=false;
{{/if ~}}