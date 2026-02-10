import { checkKarmaBlacklist } from '../modules/karmaService';

describe('Karma blacklist check', () => {

  it('should return true for a blacklisted email', async () => {
    const email = 'fraud@example.com';

    const result = await checkKarmaBlacklist(email);

    expect(result).toBe(true);
  });

  it('should return false for a non-blacklisted email', async () => {
    const email = 'cleanuser@test.com';

    const result = await checkKarmaBlacklist(email);

    expect(result).toBe(false);
  });

  it('should be case-insensitive', async () => {
    const email = 'FRAUD@EXAMPLE.COM';

    const result = await checkKarmaBlacklist(email);

    expect(result).toBe(true);
  });

});
