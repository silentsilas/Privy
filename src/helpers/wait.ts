export default async function wait(milliseconds: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, milliseconds);
    });
}

export async function runAndWaitUntil(runner: Function, milliseconds: number) {
    const startTime = new Date().getMilliseconds();

    await runner();

    const endTime = new Date().getMilliseconds();

    const elapsedTime = endTime - startTime;

    if (elapsedTime < milliseconds) {
      await wait(milliseconds - elapsedTime);
    }
};