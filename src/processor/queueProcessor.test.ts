import { pushForProcessing } from "./queueProcessor";
import getAMQChannel from "../config/amqConfig";

jest.mock("../config/amqConfig");

describe("Queue Processor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("pushForProcessing", () => {
        it("should push fileId to the queue", async () => {
            const fileId = "test-file-id";
            const mockSendToQueue = jest.fn();
            const mockAmqChannel = {
                sendToQueue: mockSendToQueue,
            };
            (getAMQChannel as jest.Mock).mockResolvedValueOnce(mockAmqChannel);

            await pushForProcessing(fileId);

            expect(getAMQChannel).toHaveBeenCalled();
            expect(mockSendToQueue).toHaveBeenCalledWith(
                "to_process",
                Buffer.from(fileId),
                { persistent: true }
            );
        });
    });
});
