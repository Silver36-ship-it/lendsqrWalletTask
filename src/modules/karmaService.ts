const blacklistedEmails = [
  'fraud@example.com',
  'scammer@test.com',
  'blocked@karma.com'
];

export async function checkKarmaBlacklist(email: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return blacklistedEmails.includes(email.toLowerCase());
}
