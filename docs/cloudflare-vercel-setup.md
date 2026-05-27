# Cloudflare + Vercel Setup

This guide explains how to route your traffic through Cloudflare and aggressively cache images for a Next.js app hosted on Vercel.

---

# Step 1: Create a Cloudflare Account

1. Go to the Cloudflare Registration Page.
2. Create a free account.
3. Click **Add a Site**.
4. Enter your domain name.

Example:

```txt
yourstore.com
```

5. Select the **Free Plan**.

---

# Step 2: Update Your Nameservers

Cloudflare will scan your DNS records and provide two custom nameservers.

Example:

```txt
dora.ns.cloudflare.com
matt.ns.cloudflare.com
```

## Update Nameservers at Your Domain Registrar

Log into the platform where you bought your domain:

- GoDaddy
- Namecheap
- Google Domains
- Squarespace
- etc.

Find:

```txt
Custom Nameservers
```

Replace your old nameservers with the ones provided by Cloudflare.

> NOTE:
> DNS propagation can take anywhere from 10 minutes to 24 hours globally.

---

# Step 3: Point Cloudflare to Vercel

Open:

```txt
Cloudflare Dashboard → DNS
```

## Add Root Domain A Record

```txt
Type: A
Name: @
Target: 76.76.21.21
Proxy Status: Proxied
```

> `76.76.21.21` is Vercel's official IP address.

---

## Add WWW CNAME Record

```txt
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy Status: Proxied
```

Make sure the orange cloud icon is enabled.

---

# Step 4: Configure Cloudflare Cache Rules

To reduce bandwidth usage and improve performance for e-commerce images:

Open:

```txt
Cloudflare Dashboard → Rules → Cache Rules
```

Click:

```txt
Create Rule
```

## Rule Configuration

### Rule Name

```txt
Cache Images
```

### Match Condition

Example:

```txt
URL Path contains .jpg
```

You can also cache:

```txt
.png
.webp
.avif
.next/image
```

### Cache Eligibility

```txt
Eligible for cache
```

### Edge TTL

Recommended:

```txt
1 month
```

---

# Recommended Next.js Image Formats

For best optimization:

```txt
.webp
.avif
```

---

# Optional: Cache Next.js Image Optimizer

If using the Next.js image optimizer:

```txt
/_next/image
```

Create a cache rule for it as well.

---

# Final Checklist

- [ ] Cloudflare nameservers configured
- [ ] Domain connected to Vercel
- [ ] Orange cloud proxy enabled
- [ ] Cache rules configured
- [ ] Images served via Cloudflare CDN
- [ ] HTTPS enabled