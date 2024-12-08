import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';

class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !owner || !repo) {
      throw new Error('GitHub configuration is missing. Please check your .env file.');
    }

    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  private async getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const base64Content = await this.getBase64(file);
      const path = `images/${Date.now()}-${file.name}`;

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: `Upload image: ${file.name}`,
        content: base64Content,
        branch: this.branch,
      });

      // Return the raw GitHub content URL
      return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
    } catch (error) {
      console.error('Error uploading image to GitHub:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();
