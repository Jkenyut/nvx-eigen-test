const { z } = require("zod");
// check validate body pinjam dan pengembalian
exports.pinjamValidate = z.object({
  member: z
    .string({
      message: "Must valid code member",
      required_error: "member is required",
      invalid_type_error: "member must be a string",
    })
    .trim(),
  buku: z
    .string({
      message: "Must valid code book",
      required_error: "buku is required",
      invalid_type_error: "buku must be a string",
    })
    .trim(),
  tgl_pinjam: z
    .string({
      message: "Must valid code book",
      required_error: "tgl_pinjam is required",
      invalid_type_error: "tgl_pinjam must be a string",
    })
    .datetime({ message: "Invalid datetime string! Must be UTC." })
    .optional(),
  // jumlah: z
  //   .number({ message: "Must valid number" })
  //   .int({ message: "type integer" })
  //   .min(1, { message: "min 1 stock" }),
});

exports.pengembalianValidate = z.object({
  member: z
    .string({
      message: "Must valid code member",

      required_error: "member is required",
      invalid_type_error: "member must be a string",
    })
    .trim(),
  buku: z
    .string({
      message: "Must valid code book",
      required_error: "buku is required",
      invalid_type_error: "buku must be a string",
    })
    .trim(),
  tgl_pengembalian: z
    .string({
      message: "Must valid code date",
      required_error: " tgl_pengembalian is required",
      invalid_type_error: " tgl_pengembalian must be a string",
    })
    .datetime({ message: "Invalid datetime string! Must be UTC." })
    .optional(),
});
