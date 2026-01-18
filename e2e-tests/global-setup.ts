import { GenericContainer } from 'testcontainers';
import path from 'path';

async function globalSetup() {
	console.log('Building Docker image...');
	const dockerfilePath = path.resolve(__dirname, '../');
	await GenericContainer
		.fromDockerfile(dockerfilePath)
		.build('together-we-choose-e2e-test-image', { deleteOnExit: false });
	
	console.log('Docker image "together-we-choose-e2e-test-image" built successfully');
}

export default globalSetup;
