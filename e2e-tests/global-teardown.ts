import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function globalTeardown() {
	console.log('Cleaning up Docker resources...');
	
	try {
		await execAsync('docker container prune -f');
		console.log('Removed stopped containers');
	} catch (error) {
		console.warn('Failed to prune containers:', error);
	}
	
	try {
		await execAsync('docker image rm together-we-choose-e2e-test-image -f');
		console.log('Docker image "together-we-choose-e2e-test-image" removed');
	} catch (error) {
		console.warn('Failed to remove Docker image:', error);
	}
	
	try {
		await execAsync('docker image prune -f');
		console.log('Removed dangling images');
	} catch (error) {
		console.warn('Failed to prune images:', error);
	}
}

export default globalTeardown;
