(function () {
	angular.module('windows', [])
	.config(function($sceDelegateProvider) {

		allAppsUrls = ['self'];

		for (var i in availableApps) {
			if(availableApps[i]["url"] !== undefined) {
				allAppsUrls.push(availableApps[i]["url"]);
			}

			if (availableApps[i]["sub-list"] !== undefined) {
				var subList = availableApps[i]["sub-list"];
				for (var j in subList) {
					if(subList[j]["url"] !== undefined) {
						allAppsUrls.push(subList[j]["url"]);
					}
				}
			}
		}

		//console.log('allAppsUrls');console.log(allAppsUrls);

		$sceDelegateProvider.resourceUrlWhitelist(allAppsUrls);

		// The blacklist overrides the whitelist so the open redirect here is blocked.
		$sceDelegateProvider.resourceUrlBlacklist([
		    'http://badwebsites.example.com/'
		]);
	});
})()