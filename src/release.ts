import { Uri } from "vscode";
import GithubRelease from "./github/release";
import ReleaseVersion from "./release/version";

namespace Release {
	export interface T {
		name: string;
		version: ReleaseVersion.T;
		archiveUrl: Uri;
	}

	export function fromGithubRelease(githubRelease: GithubRelease.T): T {
		if (githubRelease.name === null) {
			throw new Error("Github release did not contain a name.");
		}

		return {
			name: githubRelease.name,
			version: ReleaseVersion.fromGithubReleaseName(githubRelease.name),
			archiveUrl: findArchiveUri(githubRelease),
		};
	}

	function findArchiveUri(githubRelease: GithubRelease.T): Uri {
		const zipAsset = githubRelease.assets.find(
			(asset) => asset.name === "lexical.zip",
		);

		if (zipAsset === undefined) {
			throw new Error(
				`Github release ${githubRelease.name} did not contain the expected assets.`,
			);
		}

		return Uri.parse(zipAsset.browser_download_url);
	}
}

export default Release;
