import { getDetailedSheets } from "./getDetailedSheets"
import { getSheetDetails } from "./getSheetDetails"
import { getSheets } from "./getSheets"
import { IDeskproClient } from "@deskpro/app-sdk"

jest.mock("./getSheets")
jest.mock("./getSheetDetails")

describe("getDetailedSheets", () => {
    let mockClient: IDeskproClient

    beforeEach(() => {
        mockClient = {} as IDeskproClient
        jest.clearAllMocks()
    });

    it("should return an empty array if no sheets are found", async () => {
        (getSheets as jest.Mock).mockResolvedValue({ data: [] });

        const result = await getDetailedSheets(mockClient)
        expect(result).toEqual([]);
        expect(getSheets).toHaveBeenCalledWith(mockClient)
    })

    it("should return detailed sheets when getSheetDetails succeeds", async () => {
        const mockSheets = { data: [
            { id: 1, name: "Sheet 1", accessLevel: "OWNER", createdAt: "", modifiedAt: "" },
            { id: 2, name: "Sheet 2", accessLevel: "EDITOR", createdAt: "", modifiedAt: "" }
        ]};

        const mockSheetDetails1 = { id: 1, name: "Sheet 1", columns: [], rows: [], createdAt: "", modifiedAt: "" }
        const mockSheetDetails2 = { id: 2, name: "Sheet 2", columns: [], rows: [], createdAt: "", modifiedAt: "" };

        (getSheets as jest.Mock).mockResolvedValue(mockSheets);
        (getSheetDetails as jest.Mock)
            .mockImplementation((_, sheetId) => {
                return sheetId === 1 ? Promise.resolve(mockSheetDetails1) : Promise.resolve(mockSheetDetails2)
            });

        const result = await getDetailedSheets(mockClient);
        expect(result).toHaveLength(2);
        expect(result).toEqual([
            { metadata: mockSheets.data[0], data: mockSheetDetails1 },
            { metadata: mockSheets.data[1], data: mockSheetDetails2 }
        ]);
        expect(getSheets).toHaveBeenCalledWith(mockClient);
        expect(getSheetDetails).toHaveBeenCalledTimes(2);
    });

    it("should filter out sheets that fail to fetch details", async () => {
        const mockSheets = { data: [
            { id: 1, name: "Sheet 1", accessLevel: "OWNER", createdAt: "", modifiedAt: "" },
            { id: 2, name: "Sheet 2", accessLevel: "EDITOR", createdAt: "", modifiedAt: "" }
        ]};

        const mockSheetDetails1 = { id: 1, name: "Sheet 1", columns: [], rows: [], createdAt: "", modifiedAt: "" };

        (getSheets as jest.Mock).mockResolvedValue(mockSheets);
        (getSheetDetails as jest.Mock)
            .mockImplementation((_, sheetId) => {
                return sheetId === 1 ? Promise.resolve(mockSheetDetails1) : Promise.reject(new Error("Failed to fetch"))
            });

        const result = await getDetailedSheets(mockClient);
        expect(result).toHaveLength(1);
        expect(result).toEqual([
            { metadata: mockSheets.data[0], data: mockSheetDetails1 }
        ]);
        expect(getSheetDetails).toHaveBeenCalledTimes(2)
    });

    it("should return an empty array if an error occurs", async () => {
        (getSheets as jest.Mock).mockRejectedValue(new Error("API error"))

        const result = await getDetailedSheets(mockClient);
        expect(result).toEqual([])
    });
});
