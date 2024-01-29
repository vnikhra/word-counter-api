import { generateUploadUrl, generateDownloadUrl } from "./s3Processor";
import { getPublicDownloadURL, getPublicUploadURL } from "../utils/s3Utils";
import { s3 } from "../config/s3Config";

jest.mock("../utils/s3Utils");
jest.mock("../config/s3Config");

describe("File Processor", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("generateUploadUrl", () => {
        it("should generate an upload URL using s3 and return it", async () => {
            const fileId = "test-file-id";
            const expectedUploadUrl = "http://example.com/upload-url";
            (getPublicUploadURL as jest.Mock).mockResolvedValueOnce(expectedUploadUrl);

            const result = await generateUploadUrl(fileId);

            expect(result).toBe(expectedUploadUrl);
            expect(getPublicUploadURL).toHaveBeenCalledWith(s3, "word-counter-raw-files", fileId);
        });
    });

    describe("generateDownloadUrl", () => {
        it("should generate a download URL using s3 and return it", async () => {
            const fileId = "test-file-id";
            const expectedDownloadUrl = "http://example.com/download-url";
            (getPublicDownloadURL as jest.Mock).mockResolvedValueOnce(expectedDownloadUrl);

            const result = await generateDownloadUrl(fileId);

            expect(result).toBe(expectedDownloadUrl);
            expect(getPublicDownloadURL).toHaveBeenCalledWith(s3, "word-counter-result", fileId);
        });
    });
});
