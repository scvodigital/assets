{{#if @root.data.auth ~}}
CALL _removeSubscriptionParameter(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.shortlistCampaignName '-' @root.data.currentSite.name)}}},
  {{{mysqlEscape @root.request.params.query.name}}},
  'id',
  {{{mysqlEscape @root.request.params.query.id}}}
);
{{else}}
SET @query=false;
{{/if ~}}