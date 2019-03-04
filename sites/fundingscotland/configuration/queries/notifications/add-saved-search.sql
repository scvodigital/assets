{{#if @root.data.auth ~}}
CALL _addSubscriptionParameters(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.emailCampaignName '-' @root.data.currentSite.name)}}},
  {{{mysqlEscape (
    querystringify (obj)
      keywords=@root.request.params.query.keywords
      activities=@root.request.params.query.activities
      beneficiaries=@root.request.params.query.beneficiaries
      geographical_areas_funded=(sort @root.request.params.query.geographical_areas_funded)
      type_of_cost=(sort @root.request.params.query.type_of_cost)
      type_of_funding=(sort @root.request.params.query.type_of_funding)
      source_of_fund=@root.request.params.query.source_of_fund
      miscellaneous=@root.request.params.query.miscellaneous
    )
  }}},
  {{{mysqlEscape @root.request.params.query.name}}},
  {{#if @root.request.params.query.subscribe}}1{{else}}0{{/if}}
);
{{else}}
SET @query=false;
{{/if ~}}