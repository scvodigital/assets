{{#if @root.data.auth ~}}
CALL _getSubscriptions(
  {{{mysqlEscape @root.data.auth.email}}},
  NULL,
  NULL
);
{{else}}
SET @query=false;
{{/if ~}}