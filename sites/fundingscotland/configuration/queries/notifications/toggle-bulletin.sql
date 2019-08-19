{{#if @root.data.auth ~}}
CALL _addSubscriptionParameters(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.data.bulletinName}}},
  {{{mysqlEscape "bulletin=placeholder"}}},
  {{{mysqlEscape (concat @root.context.metaData.bulletinCampaignName '-' @root.data.currentSite.name)}}},
  {{#compare @root.request.params.query.subscribe "true"}}1{{else}}0{{/compare}}
);
{{else}}
SET @query=false;
{{/if ~}}