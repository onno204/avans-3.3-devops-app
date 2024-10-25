import { PAHandlerBuild } from '../pipelines/handlers/PAHandlerBuild';
import { PAHandlerDeploy } from '../pipelines/handlers/PAHandlerDeploy';
import { PAHandlerFail } from '../pipelines/handlers/PAHandlerFail';
import { PAHandlerPackage } from '../pipelines/handlers/PAHandlerPackage';
import { PAHandlerSources } from '../pipelines/handlers/PAHandlerSources';
import { Pipeline } from '../pipelines/Pipeline';

describe('Pipelines', () => {
  test('Er kan een nieuwe pipeline worden gekoppeld aan een SCM.', () => {
    // TODO: Write test
    expect(0).toBe(0);
  });

  test('Je kan meerdere acties achter elkaar koppelen in de pipeline zodat deze achter elkaar uitgevoerd kunnen worden. Wanneer een actie faalt worden de acties hierna niet uitgevoerd.', () => {
    // prepare
    const pipeline = new Pipeline();
    const sourceBuilder = new PAHandlerSources();
    const buildBuilder = new PAHandlerBuild();
    const packageBuilder = new PAHandlerPackage();
    const deployBuilder = new PAHandlerDeploy();

    pipeline.setPipelineHandler(sourceBuilder);
    sourceBuilder.setNext(buildBuilder);
    buildBuilder.setNext(packageBuilder);
    packageBuilder.setNext(deployBuilder);

    // Run
    const output: string[] = pipeline.execute();

    // Validate that the output has 4 items/handler responses
    expect(output).toHaveLength(4);
    expect(output[0]).toBe('Sources handler called');
    expect(output[1]).toBe('Build handler called');
    expect(output[2]).toBe('Package handler called');
    expect(output[3]).toBe('Deploy handler called');
  });

  test('Een pipeline kan falen.', () => {
    const pipeline = new Pipeline();
    const sourceBuilder = new PAHandlerSources();
    const failHandler = new PAHandlerFail();
    pipeline.setPipelineHandler(sourceBuilder);
    sourceBuilder.setNext(failHandler);

    // Run
    expect(() => {
      pipeline.execute();
    }).toThrowError('Broken handler called');
  });

  // describe("Test de notificaties en rapportage bij succes of falen van pipeline-stappen.", () => {
  //   test("result", () => {
  //     expect(0).toBe(0);
  //   });
  // });
});
