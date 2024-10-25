import { RepositoryController } from '../controllers/RepositoryController';
import { SCManagerSubversionAdapter } from '../scm/controllers/adapters/SCManagerSubversionAdapter';
import { iSCManager } from '../scm/controllers/iSCManager';
import { SCManagerGitController } from '../scm/controllers/SCManagerGitController';
import { SCManagerSubversionController } from '../scm/controllers/SCManagerSubversionController';
import { SCMGitRepository } from '../scm/SCMGitRepository';
import { SCMSubversionRepository } from '../scm/SCMSubversionRepository';

// Generate the Git SCM
const getGitScm = (): iSCManager => {
  const repositories = RepositoryController.get<SCMGitRepository>(
    new SCMGitRepository('')
  );
  return new SCManagerGitController(repositories);
};

// Generate the Subversion SCM
const getSubversionScm = (): iSCManager => {
  const repositories = RepositoryController.get<SCMSubversionRepository>(
    new SCMSubversionRepository('')
  );
  const subVersion = new SCManagerSubversionController(repositories);
  const scManagerGitAdapter: iSCManager = new SCManagerSubversionAdapter(
    subVersion
  );
  return scManagerGitAdapter;
};

// Run the test for both SCM's
const runTestForBothScm = (testScm: (scm: iSCManager) => void) => {
  // prepare
  const scManagerGit: iSCManager = getGitScm();
  const scManagerSubVersion: iSCManager = getSubversionScm();

  // test
  test('Git', () => {
    testScm(scManagerGit);
  });
  test('Subversion', () => {
    testScm(scManagerSubVersion);
  });
};

// The actual tests
describe('Software Configuration Management', () => {
  describe('Er moeten verschillende systemen zoals Git en SubVersion gekoppeld kunnen worden aan het SCM.', () => {
    runTestForBothScm((scm: iSCManager) => {
      // test
      const newRepositoryName = 'setupTest';
      scm.createRepository(newRepositoryName);
      const repository = scm.getRepositoryByName(newRepositoryName);

      // validate
      expect(repository).toBeDefined();
      expect(repository?.getName()).toBe(newRepositoryName);
    });
  });

  describe('Via het SCM kan je een nieuwe repository met een naam aanmaken.', () => {
    runTestForBothScm((scm: iSCManager) => {
      //test
      const newRepositoryName = 'TestAwesomeRepository';
      scm.createRepository(newRepositoryName);

      // validate
      const repository = scm.getRepositoryByName(newRepositoryName);
      expect(repository).toBeDefined();
      expect(repository?.getName()).toBe(newRepositoryName);
    });
  });

  describe('Je kan een branch aanmaken in een repository in het SCM', () => {
    runTestForBothScm((scm: iSCManager) => {
      // create repository
      const newRepositoryName = 'TestAwesomeRepositoryasd';
      expect(scm.createRepository(newRepositoryName)).toBe(true);
      const repository = scm.getRepositoryByName(newRepositoryName);
      expect(repository).toBeDefined();
      expect(repository?.getName()).toBe(newRepositoryName);

      // Create new branch
      const newBranchName = 'TestAwesomeBranch';
      expect(scm.createNewBranch(newRepositoryName, newBranchName)).toBe(true);

      // Validate the new branch is created
      const repositoryWithBranch = scm.getRepositoryByName(newRepositoryName);
      expect(repositoryWithBranch).toBeDefined();
      expect(repositoryWithBranch?.getBranches()).toContain(newBranchName);
    });
  });
});