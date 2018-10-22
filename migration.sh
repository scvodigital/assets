#!/usr/bin/env bash

rsync -av --progress ../frontend/sites/configurations/digitalparticipation/* ./sites/digitalparticipation/configuration
rsync -av --progress ../frontend/sites/configurations/emailer/* ./sites/emailer/configuration
rsync -av --progress ../frontend/sites/configurations/fundingscotland/* ./sites/fundingscotland/configuration
rsync -av --progress ../frontend/sites/configurations/getinvolved-legacy/* ./sites/getinvolved-legacy/configuration
rsync -av --progress ../frontend/sites/configurations/getinvolved/* ./sites/getinvolved/configuration
rsync -av --progress ../frontend/sites/configurations/goodmoves/* ./sites/goodmoves/configuration
rsync -av --progress ../frontend/sites/configurations/humanrightsdeclaration/* ./sites/humanrightsdeclaration/configuration
rsync -av --progress ../frontend/sites/configurations/scotlandforeurope/* ./sites/scotlandforeurope/configuration
rsync -av --progress ../frontend/sites/configurations/scvo/* ./sites/scvo/configuration
rsync -av --progress ../frontend/sites/configurations/volunteerscotland-search/* ./sites/volunteerscotland-search/configuration
